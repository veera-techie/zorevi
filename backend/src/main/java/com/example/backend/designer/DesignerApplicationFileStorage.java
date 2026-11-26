package com.example.backend.designer;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Component
public class DesignerApplicationFileStorage {
	private static final long MAX_FILE_SIZE = 10L * 1024 * 1024;
	private static final List<String> ALLOWED_EXTENSIONS = List.of("pdf", "jpg", "jpeg", "png", "webp");
	private final Path uploadDirectory;

	public DesignerApplicationFileStorage(@Value("${zorevi.upload-dir:./data/designer-applications}") String uploadDirectory) {
		this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
	}

	public List<StoredApplicationFile> save(
			String applicationId,
			MultipartFile governmentId,
			List<MultipartFile> certificates,
			List<MultipartFile> portfolioFiles) throws IOException {
		List<StoredApplicationFile> storedFiles = new ArrayList<>();
		Path applicationDirectory = uploadDirectory.resolve(applicationId).normalize();
		if (!applicationDirectory.startsWith(uploadDirectory)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid application identifier.");
		}
		Files.createDirectories(applicationDirectory);
		try {
			store(applicationDirectory, "government-id", governmentId, storedFiles);
			storeAll(applicationDirectory, "certificate", certificates, storedFiles);
			storeAll(applicationDirectory, "portfolio", portfolioFiles, storedFiles);
			return storedFiles;
		} catch (IOException | RuntimeException exception) {
			deleteApplicationFiles(applicationId);
			throw exception;
		}
	}

	public void deleteApplicationFiles(String applicationId) {
		Path applicationDirectory = uploadDirectory.resolve(applicationId).normalize();
		if (!applicationDirectory.startsWith(uploadDirectory) || !Files.exists(applicationDirectory)) {
			return;
		}
		try (var paths = Files.walk(applicationDirectory)) {
			paths.sorted((first, second) -> second.compareTo(first)).forEach(path -> {
				try {
					Files.deleteIfExists(path);
				} catch (IOException exception) {
					throw new FileStorageCleanupException(exception);
				}
			});
		} catch (IOException | FileStorageCleanupException exception) {
			throw new IllegalStateException("Could not remove incomplete application uploads.", exception);
		}
	}

	private void storeAll(
			Path directory,
			String category,
			List<MultipartFile> files,
			List<StoredApplicationFile> storedFiles) throws IOException {
		if (files != null) {
			for (MultipartFile file : files) {
				store(directory, category, file, storedFiles);
			}
		}
	}

	private void store(
			Path directory,
			String category,
			MultipartFile file,
			List<StoredApplicationFile> storedFiles) throws IOException {
		if (file == null) {
			return;
		}
		if (file.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Uploaded files cannot be empty.");
		}
		if (file.getSize() > MAX_FILE_SIZE) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each uploaded file must be 10 MB or smaller.");
		}
		String originalFilename = file.getOriginalFilename();
		String extension = originalFilename == null || !originalFilename.contains(".")
				? ""
				: originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
		if (!ALLOWED_EXTENSIONS.contains(extension)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PDF, JPG, PNG, and WEBP files are allowed.");
		}
		String storageName = UUID.randomUUID() + "." + extension;
		Path destination = directory.resolve(storageName).normalize();
		if (!destination.startsWith(directory)) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid uploaded filename.");
		}
		try (InputStream input = file.getInputStream()) {
			Files.copy(input, destination);
		}
		storedFiles.add(new StoredApplicationFile(category, storageName));
	}

	private static final class FileStorageCleanupException extends RuntimeException {
		private FileStorageCleanupException(IOException cause) {
			super(cause);
		}
	}
}
