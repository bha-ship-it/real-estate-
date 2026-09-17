package com.realestate.service;

import com.realestate.entity.ZoningInformation;
import java.util.List;

public interface ZoningInformationService {
    ZoningInformation saveZoningInformation(ZoningInformation zoningInformation);
    List<ZoningInformation> getAllZoningInformation();
    ZoningInformation getZoningInformationById(Long id);
    ZoningInformation updateZoningInformation(Long id, ZoningInformation zoningInformation);
    void deleteZoningInformation(Long id);
}
