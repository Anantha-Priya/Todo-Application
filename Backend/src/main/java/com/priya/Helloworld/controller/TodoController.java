package com.priya.Helloworld.controller;

import com.priya.Helloworld.models.Todo;
import com.priya.Helloworld.service.TodoService;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todo")
@Slf4j   //used for logs
public class TodoController {
    @Autowired
    private TodoService todoService;

    //Path Variable
    @ApiResponses({
            @ApiResponse(responseCode="200",description="Todo Executed Successfully!"),
            @ApiResponse(responseCode="404",description="Todo was not Found!")
    })
    @GetMapping("/{id}")           //Retrieve single element by Id
    ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        try{
            Todo createdTodo=todoService.getTodoById(id);
            return new ResponseEntity<>(createdTodo,HttpStatus.OK);
        }catch(RuntimeException exception){
            log.info("Error");
//            log.warn("Something Went wrong with getting the id");
//            log.error("runtime error",exception);  Here, exception is an runtimeExceptions object
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }

    }

    //Request Body
    @PostMapping("/create")      // Insert Element
    ResponseEntity<Todo> createUser(@RequestBody Todo todo) {
       return new ResponseEntity<>(todoService.createTodo(todo), HttpStatus.CREATED) ;

    }

    @GetMapping("/page")        // Retrieve elements by Sequential pages
    ResponseEntity<Page<Todo>> getTodoPaged(@RequestParam int page,@RequestParam int size){
        return new ResponseEntity<>(todoService.getAllTodosPages(page,size), HttpStatus.OK);
    }

    @GetMapping                // Retrieve single element by Id
    ResponseEntity<List<Todo>> getTodos(){
        return new ResponseEntity<List<Todo>>(todoService.getTodos(),HttpStatus.OK);
    }

    @PutMapping
    ResponseEntity<Todo> updateTodoById( @RequestBody Todo todo ) {
        return new ResponseEntity<>(todoService.updateTodo(todo),HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    void deleteTodoById(@PathVariable Long id) {
        todoService.deleteTodoById(id);
    }
}
