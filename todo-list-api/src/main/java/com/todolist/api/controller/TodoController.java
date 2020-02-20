package com.todolist.api.controller;

import com.todolist.api.model.Todo;
import com.todolist.api.model.TodoResourceAssembler;
import com.todolist.api.model.TodoUserDetail;
import com.todolist.api.model.enums.Priority;
import com.todolist.api.model.enums.Status;
import com.todolist.api.repository.TodoRepository;
import com.todolist.api.service.TodoService;
import com.todolist.api.validator.TodoValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;


import javax.validation.Valid;

@RestController
@RequestMapping("api")
public class TodoController {
    private final TodoResourceAssembler assembler;
    private final PagedResourcesAssembler pagedResourcesAssembler;
    private final TodoService service;
    private final TodoValidator todoValidator;

    TodoController(TodoResourceAssembler assembler, TodoService service, TodoValidator todoValidator) {
        this.assembler = assembler;
        this.service = service;
        this.todoValidator = todoValidator;
        this.pagedResourcesAssembler = new PagedResourcesAssembler(null,null);
    }

    @InitBinder
    private void initBinder(WebDataBinder webDataBinder) {
        webDataBinder.addValidators(todoValidator);
    }


    @GetMapping("/todos")
    public PagedResources<Resource<Todo>> getAll(@RequestParam(required = false) int page, @RequestParam(required = false) int size) {
        Page<Todo> todosPage = service.findAll(page, size);

        return pagedResourcesAssembler.toResource(
                todosPage, assembler);
    }

    @GetMapping("/todos/file")
    public ResponseEntity<StreamingResponseBody> downloadAll(@RequestParam(required = false) String q,
                                                             @RequestParam(required = false) String user) {
        StreamingResponseBody stream = outputStream -> {
            service.streamAll(outputStream,q, user);
            outputStream.flush();
        };
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.add("Content-disposition", "attachment; filename=todos.csv");

        return new ResponseEntity(stream, headers, HttpStatus.OK);
    }

    @GetMapping("/todos/id/{id}")
    public Resource<Todo> getOne(@PathVariable Integer id) {
        Todo todo = service.findById(id);

        return assembler.toResource(todo);
    }

    @GetMapping("/todos/user/{username}")
    public PagedResources<Resource<Todo>> getByUsername(@PathVariable String username, @RequestParam(required = false) int page, @RequestParam(required = false) int size) {
        Page<Todo> todosPage = service.findByUserUsername(username, page, size);

        return pagedResourcesAssembler.toResource(
                todosPage, assembler);
    }

    @GetMapping("/todos/search")
    public PagedResources<Resource<Todo>> getBySearchString(@RequestParam(required = false) String q,
                                                       @RequestParam(required = false) Priority priority,
                                                       @RequestParam(required = false) Status status,
                                                       @RequestParam(required = false) String user,
                                                       @RequestParam(required = false) int page,
                                                       @RequestParam(required = false) int size) {
        Page<Todo> todosPage = service.findByCriteria(q, priority, status, user, page, size);

        return pagedResourcesAssembler.toResource(
                todosPage, assembler);
    }


    @PostMapping(value = "/todos", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Resource<Todo> create(@Valid @RequestBody Todo todo) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        TodoUserDetail todoUserDetail = (TodoUserDetail) auth.getPrincipal();
        Todo newTodo = new Todo.Builder(todo)
                .status(Status.TODO)
                .user(todoUserDetail.getTodoUser())
                .build();

        return assembler.toResource(service.save(newTodo));
    }

    @PostMapping("/todos/{id}/done")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> done(@PathVariable Integer id) {
        Todo updatedTodo = service.updateStatus(id, Status.DONE);

        return assembler.toResource(updatedTodo);
    }

    @PostMapping("/todos/{id}/in-progress")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> inProgress(@PathVariable Integer id) {
        Todo updatedTodo = service.updateStatus(id, Status.INPROGRESS);

        return assembler.toResource(updatedTodo);
    }

    @PostMapping("/todos/{id}/wont-do")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> wontDo(@PathVariable Integer id) {
        Todo updatedTodo = service.updateStatus(id, Status.WONTDO);

        return assembler.toResource(updatedTodo);
    }

    @PostMapping("/todos/{id}/undo")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> unDo(@PathVariable Integer id) {
        Todo updatedTodo = service.updateStatus(id, Status.TODO);

        return assembler.toResource(updatedTodo);
    }

    @PutMapping("/todos/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Resource<Todo> update(@RequestBody Todo todoUpdates, @PathVariable Integer id) {
        Todo updatedTodo = service.update(id, todoUpdates);

        return assembler.toResource(updatedTodo);
    }

    @DeleteMapping("/todos/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
