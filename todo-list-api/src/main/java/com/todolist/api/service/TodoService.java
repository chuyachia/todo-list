package com.todolist.api.service;

import com.todolist.api.exception.TodoNotFoundException;
import com.todolist.api.exception.UnAuthorizedOperationException;
import com.todolist.api.model.Todo;
import com.todolist.api.model.TodoUserDetail;
import com.todolist.api.model.enums.Priority;
import com.todolist.api.model.enums.Status;
import com.todolist.api.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Stream;

@Service
public class TodoService implements ITodoService {
    private static final String ADMIN_ROLE = "ROLE_A";
    private static final SimpleGrantedAuthority adminGrant =  new SimpleGrantedAuthority(ADMIN_ROLE);

    @Autowired
    private TodoRepository repository;

    @Override
    public Page<Todo> findAll(int page, int size) {
        Pageable pageable = getPageable(page, size);

        return repository.findAll(pageable);
    }

    @Override
    public Page<Todo> findByUserUsername(String username, int page, int size) {
        Pageable pageable = getPageable(page, size);

        return repository.findByUserUsername(username, pageable);
    }

    @Override
    public Page<Todo> findByCriteria(String q, Priority p, Status s, String user, int page, int size) {
        Pageable pageable = getPageable(page, size);
        Page<Todo> todos = Page.empty();

        if (q != null) {
            todos = repository.findBySearchString(q.toLowerCase(), user, pageable);
        } else if (p != null) {
            todos = user == null ? repository.findByPriority(p, pageable) : repository.findByPriorityAndUserUsername(p, user, pageable);
        } else if (p != null) {
            todos = user == null ? repository.findByStatus(s, pageable) : repository.findByStatusAndUserUsername(s, user, pageable);
        }

        return todos;
    }

    @Override
    public Todo findById(Integer id) {
        Todo todo = repository.findById(id)
                .orElseThrow(()-> new TodoNotFoundException(id));

        return todo ;
    }

    @Override
    public Todo updateStatus(Integer id, Status status) {
        Todo todo = findById(id);
        if (isTodoAuthorOrAdmin(todo)) {
            Todo newTodo = new Todo.Builder(todo)
                    .status(Status.DONE)
                    .build();

            return repository.save(newTodo);
        } else {
            throw new UnAuthorizedOperationException("Modifying other users' todos are not allowed");
        }
    }

    @Override
    public Todo update(Integer id, Todo todoUpdate) {
        Todo todo = findById(id);
        if (isTodoAuthorOrAdmin(todo)) {
            Todo newTodo = new Todo.Builder(todo)
                    .title(todoUpdate.getTitle())
                    .status(todoUpdate.getStatus())
                    .priority(todoUpdate.getPriority())
                    .description(todoUpdate.getDescription())
                    .build();

            return repository.save(newTodo);
        } else {
            throw new UnAuthorizedOperationException("Modifying other users' todos are not allowed");
        }
    }

    @Override
    public Todo save(Todo todo) {
        return repository.save(todo);
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public void streamAll(OutputStream outputStream, String q, String username) {
        Stream<Todo> todoStream = repository.streamAll(q, username);
        writeCSVHeader(outputStream);
        todoStream.forEach(todo -> writeCSVRow(todo,outputStream));
    }
    private Pageable getPageable(int page, int size) {
        Pageable pageable;
        if (size == 0 && page == 0) {
            pageable = PageRequest.of(page, size);
        } else {
            pageable = Pageable.unpaged();
        }

        return pageable;
    }

    private void writeCSVHeader(OutputStream outputStream) {
         Arrays.asList(Todo.class.getDeclaredFields()).stream()
                 .map(field -> field.getName())
                 .reduce((x, y) -> x +";" + y)
                 .ifPresent(s -> {
                     try {
                         outputStream.write(s.getBytes());
                         outputStream.write("\n".getBytes());
                     } catch (IOException e) {
                         e.printStackTrace();
                         try {
                             outputStream.close();
                         } catch (IOException ex) {
                             ex.printStackTrace();
                         }
                     }
                 });
    }

    private void writeCSVRow(Todo todo, OutputStream outputStream) {
        try {
            outputStream.write(todo.toCSVString().getBytes());
            outputStream.write("\n".getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            try {
                outputStream.close();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    private boolean isTodoAuthorOrAdmin(Todo todo) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().contains(adminGrant);
        TodoUserDetail todoUserDetail = (TodoUserDetail) auth.getPrincipal();
        return isAdmin || todo.getUser().getUsername() == todoUserDetail.getTodoUser().getUsername();
    }
}
