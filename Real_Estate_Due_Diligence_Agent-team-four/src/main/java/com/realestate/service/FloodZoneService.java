package com.realestate.service;

import com.realestate.entity.FloodZone;
import java.util.List;

public interface FloodZoneService {
    FloodZone saveFloodZone(FloodZone floodZone);
    List<FloodZone> getAllFloodZones();
    FloodZone getFloodZoneById(Long id);
    FloodZone updateFloodZone(Long id, FloodZone floodZone);
    void deleteFloodZone(Long id);
}
