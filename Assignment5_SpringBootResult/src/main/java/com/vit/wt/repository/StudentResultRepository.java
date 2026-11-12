package com.vit.wt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vit.wt.model.StudentResult;

@Repository
public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {
    Optional<StudentResult> findByPrn(String prn);
}
