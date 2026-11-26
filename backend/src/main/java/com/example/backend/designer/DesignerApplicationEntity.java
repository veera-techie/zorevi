package com.example.backend.designer;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "designer_applications")
public class DesignerApplicationEntity {
	@Id
	@Column(length = 64, nullable = false, updatable = false)
	private String applicationId;

	@Column(nullable = false)
	private String fullName;

	@Column(nullable = false)
	private String phone;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false, length = 2000)
	private String address;

	@Column(nullable = false)
	private String city;

	@Column(nullable = false, length = 20000)
	private String skillsJson;

	@Column(nullable = false)
	private String experience;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal startingPrice;

	@Column(length = 2000)
	private String portfolioLink;

	@Column(nullable = false, length = 30000)
	private String attachmentsJson;

	@Column(nullable = false)
	private String status;

	@Column(nullable = false)
	private Instant submittedAt;

	protected DesignerApplicationEntity() {
	}

	public DesignerApplicationEntity(
			String applicationId,
			String fullName,
			String phone,
			String email,
			String address,
			String city,
			String skillsJson,
			String experience,
			BigDecimal startingPrice,
			String portfolioLink,
			String attachmentsJson,
			String status,
			Instant submittedAt) {
		this.applicationId = applicationId;
		this.fullName = fullName;
		this.phone = phone;
		this.email = email;
		this.address = address;
		this.city = city;
		this.skillsJson = skillsJson;
		this.experience = experience;
		this.startingPrice = startingPrice;
		this.portfolioLink = portfolioLink;
		this.attachmentsJson = attachmentsJson;
		this.status = status;
		this.submittedAt = submittedAt;
	}

	public String getApplicationId() {
		return applicationId;
	}

	public String getFullName() {
		return fullName;
	}

	public String getPhone() {
		return phone;
	}

	public String getEmail() {
		return email;
	}

	public String getAddress() {
		return address;
	}

	public String getCity() {
		return city;
	}

	public String getSkillsJson() {
		return skillsJson;
	}

	public String getExperience() {
		return experience;
	}

	public BigDecimal getStartingPrice() {
		return startingPrice;
	}

	public String getPortfolioLink() {
		return portfolioLink;
	}

	public String getAttachmentsJson() {
		return attachmentsJson;
	}

	public String getStatus() {
		return status;
	}

	public Instant getSubmittedAt() {
		return submittedAt;
	}
}
