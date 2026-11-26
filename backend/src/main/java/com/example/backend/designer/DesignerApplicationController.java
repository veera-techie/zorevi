package com.example.backend.designer;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/designer-applications")
public class DesignerApplicationController {
	private final DesignerApplicationService service;

	public DesignerApplicationController(DesignerApplicationService service) {
		this.service = service;
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<DesignerApplicationResponse> submit(
			@RequestPart("application") DesignerApplicationRequest request,
			@RequestPart(value = "governmentId", required = false) MultipartFile governmentId,
			@RequestPart(value = "certificates", required = false) List<MultipartFile> certificates,
			@RequestPart(value = "portfolioFiles", required = false) List<MultipartFile> portfolioFiles) {
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(service.submit(request, governmentId, certificates, portfolioFiles));
	}

	@GetMapping("/{applicationId}")
	public DesignerApplicationResponse get(@PathVariable String applicationId) {
		return service.get(applicationId);
	}
}
