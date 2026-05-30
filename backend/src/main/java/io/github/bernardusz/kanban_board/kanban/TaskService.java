package io.github.bernardusz.kanban_board.kanban;

import io.github.bernardusz.kanban_board.kanban.dto.TaskCreateRequest;
import io.github.bernardusz.kanban_board.kanban.dto.TaskSummary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
  private final TaskRepository taskRepository;
  public TaskService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  @Transactional(readOnly = true)
  public List<TaskSummary> findAll() {
    return taskRepository.findAll();
  }

  @Transactional(readOnly = true)
  public Optional<Task> findById(Long id) {
    return taskRepository.findById(id);
  }

  @Transactional
  public Optional<Long> createTask (TaskCreateRequest newTask) {
    return taskRepository.create(newTask);
  }

  @Transactional
  public void updateTask(TaskCreateRequest task, Long id) {
    taskRepository.update(task, id);
  }

  @Transactional
  public void deleteTask(Long id) {
    taskRepository.delete(id);
  }
}
