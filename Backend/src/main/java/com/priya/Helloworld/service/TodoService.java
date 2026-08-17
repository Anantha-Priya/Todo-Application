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
    public Todo createTodo(Todo todo){
         return todoRepository.save(todo);
    }

    //Retrieve specific id
    public Todo getTodoById(Long id){
        return todoRepository.findById(id).orElseThrow(() -> new RuntimeException("Todo not Found"));
    }

    //Show data in the pagewise
    public Page<Todo> getAllTodosPages(int page,int size){
        Pageable pageable= PageRequest.of(page,size);
        return todoRepository.findAll(pageable);
    }

    //Retrieve All
    public List<Todo> getTodos(){
        return todoRepository.findAll();
    }

    public Todo updateTodo(Todo todo){
        return todoRepository.save(todo);

    }

    public void deleteTodoById(Long id){
        todoRepository.delete(getTodoById(id));
    }

    public void deleteTodo(Todo todo){
        todoRepository.delete(todo);
    }
    }


