package com.campus.canteen.repository;

import com.campus.canteen.entity.PickupSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickupSlotRepository extends JpaRepository<PickupSlot, Long> {
    List<PickupSlot> findByActiveTrueOrderByStartTimeAsc();
    List<PickupSlot> findAllByOrderByStartTimeAsc();
}
