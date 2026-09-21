package com.priya.Helloworld.service;

import com.priya.Helloworld.models.Todo;
import com.priya.Helloworld.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {
    @Autowired
    private TodoRepository todoRepository;

    //Insert
    public Todo createTodo(Todo todo, String ownerEmail){
        todo.setOwnerEmail(ownerEmail);
        return todoRepository.save(todo);
    }

    //Retrieve specific id (only if it belongs to the requesting user)
    public Todo getTodoById(Long id, String ownerEmail){
        return todoRepository.findByIdAndOwnerEmail(id, ownerEmail).orElseThrow(() -> new RuntimeException("Todo not Found"));
    }

    //Show data in the pagewise
    public Page<Todo> getAllTodosPages(int page,int size, String ownerEmail){
        Pageable pageable= PageRequest.of(page,size);
        return todoRepository.findByOwnerEmail(ownerEmail, pageable);
    }

    //Retrieve All todos belonging to the requesting user
    public List<Todo> getTodos(String ownerEmail){
        return todoRepository.findByOwnerEmail(ownerEmail);
    }

    public Todo updateTodo(Todo todo, String ownerEmail){
        // ensure the todo being updated actually belongs to the requesting user
        getTodoById(todo.getId(), ownerEmail);
        todo.setOwnerEmail(ownerEmail);
        return todoRepository.save(todo);
    }

    public void deleteTodoById(Long id, String ownerEmail){
        todoRepository.delete(getTodoById(id, ownerEmail));
    }

    public void deleteTodo(Todo todo){
        todoRepository.delete(todo);
    }
    }

