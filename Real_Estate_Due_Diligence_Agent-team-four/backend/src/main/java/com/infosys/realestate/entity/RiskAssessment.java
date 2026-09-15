package com.infosys.realestate.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "risk_assessments")
public class RiskAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(nullable = false)
    private String riskLevel; // LOW, MEDIUM, HIGH

    private Integer riskScore;

    @Column(length = 1000)
    private String comments;

    @Column(name = "title_risk_score")
    private Integer titleRiskScore = 10;

    @Column(name = "tax_risk_score")
    private Integer taxRiskScore = 10;

    @Column(name = "zoning_risk_score")
    private Integer zoningRiskScore = 10;

    @Column(name = "flood_risk_score")
    private Integer floodRiskScore = 10;

    @Column(name = "environmental_risk_score")
    private Integer environmentalRiskScore = 10;

    @Column(name = "overall_risk_score")
    private Integer overallRiskScore = 15;

    @Column(name = "mitigation_recommendations", length = 2000)
    private String mitigationRecommendations;

    @Column(name = "assessed_at")
    private LocalDateTime assessedAt = LocalDateTime.now();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public RiskAssessment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { 
        this.riskScore = riskScore; 
        this.overallRiskScore = riskScore;
    }

    public Integer getTitleRiskScore() { return titleRiskScore; }
    public void setTitleRiskScore(Integer titleRiskScore) { this.titleRiskScore = titleRiskScore; }

    public Integer getTaxRiskScore() { return taxRiskScore; }
    public void setTaxRiskScore(Integer taxRiskScore) { this.taxRiskScore = taxRiskScore; }

    public Integer getZoningRiskScore() { return zoningRiskScore; }
    public void setZoningRiskScore(Integer zoningRiskScore) { this.zoningRiskScore = zoningRiskScore; }

    public Integer getFloodRiskScore() { return floodRiskScore; }
    public void setFloodRiskScore(Integer floodRiskScore) { this.floodRiskScore = floodRiskScore; }

    public Integer getEnvironmentalRiskScore() { return environmentalRiskScore; }
    public void setEnvironmentalRiskScore(Integer environmentalRiskScore) { this.environmentalRiskScore = environmentalRiskScore; }

    public Integer getOverallRiskScore() { return overallRiskScore; }
    public void setOverallRiskScore(Integer overallRiskScore) { this.overallRiskScore = overallRiskScore; }

    public String getMitigationRecommendations() { return mitigationRecommendations; }
    public void setMitigationRecommendations(String mitigationRecommendations) { this.mitigationRecommendations = mitigationRecommendations; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getAssessedAt() { return assessedAt; }
    public void setAssessedAt(LocalDateTime assessedAt) { this.assessedAt = assessedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
