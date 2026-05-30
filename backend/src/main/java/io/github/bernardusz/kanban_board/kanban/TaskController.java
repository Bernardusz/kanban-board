package io.github.bernardusz.kanban_board.kanban;

import io.github.bernardusz.kanban_board.kanban.dto.TaskCreateRequest;
import io.github.bernardusz.kanban_board.kanban.dto.TaskSingularUpdate;
import io.github.bernardusz.kanban_board.kanban.dto.TaskSummary;
import io.github.bernardusz.kanban_board.kanban.dto.TaskBatchUpdate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {
  private final TaskService taskService;
  public TaskController(TaskService taskService) {
    this.taskService = taskService;
  }

  @GetMapping
  public ResponseEntity<List<TaskSummary>> findAll() {
    return ResponseEntity.ok(taskService.findAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Task> findById(@PathVariable Long id) {
    return taskService.findById(id)
      .map(task -> ResponseEntity.ok(task))
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Void> create(@RequestBody TaskCreateRequest task) {
    return taskService.createTask(task)
      .map(status ->{
        URI location = ServletUriComponentsBuilder
          .fromCurrentRequest()
          .path("/{id}")
          .buildAndExpand(status)
          .toUri();
        return ResponseEntity.created(location).<Void>build();
      }
      )
      .orElse(ResponseEntity.internalServerError().build());
  }

  @PutMapping
  public ResponseEntity<Void> update(@RequestBody List<TaskBatchUpdate> task) {
    taskService.updateTasks(task);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody TaskSingularUpdate task) {
    taskService.updateTask(task, id);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    taskService.deleteTask(id);
    return ResponseEntity.noContent().build();
  }
}
