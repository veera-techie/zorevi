package com.example.backend.designer;

import java.math.BigDecimal;
import java.util.List;

public record DesignerApplicationRequest(
		String fullName,
		String phone,
		String email,
		String address,
		String city,
		List<String> skills,
		String experience,
		BigDecimal startingPrice,
		String portfolioLink) {
}
