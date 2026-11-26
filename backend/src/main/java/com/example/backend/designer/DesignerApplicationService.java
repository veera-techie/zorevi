package com.example.backend.designer;

import java.io.IOException;
import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DesignerApplicationService {
	private static final TypeReference<List<String>> SKILLS_TYPE = new TypeReference<>() {};
	private static final TypeReference<List<StoredApplicationFile>> FILES_TYPE = new TypeReference<>() {};

	private final DesignerApplicationRepository repository;
	private final DesignerApplicationFileStorage fileStorage;
	private final ObjectMapper objectMapper;

	public DesignerApplicationService(
			DesignerApplicationRepository repository,
			DesignerApplicationFileStorage fileStorage,
			ObjectMapper objectMapper) {
		this.repository = repository;
		this.fileStorage = fileStorage;
		this.objectMapper = objectMapper;
	}

	@Transactional
	public DesignerApplicationResponse submit(
			DesignerApplicationRequest request,
			MultipartFile governmentId,
			List<MultipartFile> certificates,
			List<MultipartFile> portfolioFiles) {
		validate(request);
		String applicationId = newApplicationId();
		try {
			List<StoredApplicationFile> attachments =
					fileStorage.save(applicationId, governmentId, certificates, portfolioFiles);
			DesignerApplicationEntity entity = new DesignerApplicationEntity(
					applicationId,
					request.fullName().trim(),
					request.phone().trim(),
					request.email().trim(),
					request.address().trim(),
					request.city().trim(),
					writeJson(request.skills().stream().map(String::trim).toList()),
					request.experience().trim(),
					request.startingPrice(),
					StringUtils.hasText(request.portfolioLink()) ? request.portfolioLink().trim() : null,
					writeJson(attachments),
					"PENDING_REVIEW",
					Instant.now());
			repository.saveAndFlush(entity);
			return toResponse(entity);
		} catch (IOException | RuntimeException exception) {
			fileStorage.deleteApplicationFiles(applicationId);
			throw exception instanceof ResponseStatusException statusException
					? statusException
					: new IllegalStateException("Could not save the designer application.", exception);
		}
	}

	@Transactional(readOnly = true)
	public DesignerApplicationResponse get(String applicationId) {
		return repository.findById(applicationId)
				.map(this::toResponse)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found."));
	}

	private void validate(DesignerApplicationRequest request) {
		if (request == null
				|| !StringUtils.hasText(request.fullName())
				|| !StringUtils.hasText(request.phone())
				|| !StringUtils.hasText(request.email())
				|| !request.email().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
				|| !StringUtils.hasText(request.address())
				|| !StringUtils.hasText(request.city())
				|| request.skills() == null
				|| request.skills().isEmpty()
				|| request.skills().stream().anyMatch(skill -> !StringUtils.hasText(skill))
				|| !StringUtils.hasText(request.experience())
				|| request.startingPrice() == null
				|| request.startingPrice().signum() < 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Complete all required application fields.");
		}
	}

	private DesignerApplicationResponse toResponse(DesignerApplicationEntity entity) {
		List<String> skills = readJson(entity.getSkillsJson(), SKILLS_TYPE);
		List<StoredApplicationFile> files = readJson(entity.getAttachmentsJson(), FILES_TYPE);
		return new DesignerApplicationResponse(
				entity.getApplicationId(),
				entity.getFullName(),
				entity.getPhone(),
				entity.getEmail(),
				entity.getAddress(),
				entity.getCity(),
				skills,
				entity.getExperience(),
				entity.getStartingPrice(),
				entity.getPortfolioLink(),
				files.stream().filter(file -> file.category().equals("portfolio")).map(StoredApplicationFile::storageName).toList(),
				files.stream().filter(file -> file.category().equals("certificate")).map(StoredApplicationFile::storageName).toList(),
				files.stream().anyMatch(file -> file.category().equals("government-id")),
				entity.getStatus(),
				entity.getSubmittedAt());
	}

	private String newApplicationId() {
		return "DSN-" + Year.now() + "-" + UUID.randomUUID().toString().toUpperCase();
	}

	private String writeJson(Object value) {
		try {
			return objectMapper.writeValueAsString(value);
		} catch (JsonProcessingException exception) {
			throw new IllegalStateException("Could not encode application details.", exception);
		}
	}

	private <T> T readJson(String value, TypeReference<T> type) {
		try {
			return objectMapper.readValue(value, type);
		} catch (JsonProcessingException exception) {
			throw new IllegalStateException("Could not read saved application details.", exception);
		}
	}
}
