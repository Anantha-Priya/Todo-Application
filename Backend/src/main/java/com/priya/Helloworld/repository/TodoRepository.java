package com.priya.Helloworld.repository;


import com.priya.Helloworld.models.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo,Long> {
    List<Todo> findByOwnerEmail(String ownerEmail);
    Page<Todo> findByOwnerEmail(String ownerEmail, Pageable pageable);
    Optional<Todo> findByIdAndOwnerEmail(long id, String ownerEmail);
}
