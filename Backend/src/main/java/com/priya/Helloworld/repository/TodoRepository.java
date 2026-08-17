package com.priya.Helloworld.repository;


import com.priya.Helloworld.models.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo,Long> {

}
