package com.example.backend.designer;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record DesignerApplicationResponse(
		String applicationId,
		String fullName,
		String phone,
		String email,
		String address,
		String city,
		List<String> skills,
		String experience,
		BigDecimal startingPrice,
		String portfolioLink,
		List<String> portfolioFiles,
		List<String> certificates,
		boolean governmentIdUploaded,
		String status,
		Instant submittedAt) {
}
