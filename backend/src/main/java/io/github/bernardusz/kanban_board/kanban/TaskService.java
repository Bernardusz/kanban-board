package io.github.bernardusz.kanban_board.kanban;

import io.github.bernardusz.kanban_board.kanban.dto.TaskCreateRequest;
import io.github.bernardusz.kanban_board.kanban.dto.TaskSummary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {
  private final TaskRepository taskRepository;
  public TaskService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  @Transactional
  public List<TaskSummary> findAll() {
    return taskRepository.findAll();
  }

  @Transactional
  public Task findById(long id) {
    return taskRepository.findById(id);
  }

  @Transactional
  public void createTask (TaskCreateRequest newTask) {
    taskRepository.create(newTask);
  }

  @Transactional
  public void updateTask(Task task) {
    taskRepository.update(task);
  }

  @Transactional
  public void deleteTask(long id) {
    taskRepository.delete(id);
  }
}
