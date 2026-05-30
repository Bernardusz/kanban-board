package io.github.bernardusz.kanban_board.kanban;

import io.github.bernardusz.kanban_board.kanban.dto.TaskCreateRequest;
import io.github.bernardusz.kanban_board.kanban.dto.TaskSingularUpdate;
import io.github.bernardusz.kanban_board.kanban.dto.TaskSummary;
import io.github.bernardusz.kanban_board.kanban.dto.TaskBatchUpdate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    return taskRepository.create(newTask, taskRepository.getTodoCount());
  }

  @Transactional
  public void updateTask(TaskSingularUpdate task, Long id) {
    taskRepository.update(task, id);
  }

  @Transactional
  public void updateTasks(List<TaskBatchUpdate> tasks) {
    taskRepository.update(tasks);
  }

  @Transactional
  public void deleteTask(Long id) {
    taskRepository.delete(id);
  }
}
