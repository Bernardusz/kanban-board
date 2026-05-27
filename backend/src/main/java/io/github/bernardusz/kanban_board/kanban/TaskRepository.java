package io.github.bernardusz.kanban_board.kanban;

import io.github.bernardusz.kanban_board.kanban.dto.TaskCreateRequest;
import io.github.bernardusz.kanban_board.kanban.dto.TaskSummary;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TaskRepository {
  private final JdbcClient jdbcClient;
  public TaskRepository(JdbcClient jdbcClient) {
    this.jdbcClient = jdbcClient;
  }

  public List<TaskSummary> findAll() {
    return jdbcClient.sql("""
            SELECT 
            id, title, status, created_at, updated_at
            FROM tasks
            ORDER BY created_at ASC
            """)
      .query(TaskSummary.class).list();
  }

  public Optional<Task> findById(Long id) {
    return jdbcClient.sql("SELECT * FROM tasks WHERE id = ?").param(id).query(Task.class).optional();
  }

  public Optional<Long> create(TaskCreateRequest task){
    return jdbcClient.sql("INSERT INTO tasks (title, description, status) VALUES (?, ?, ?) RETURNING id")
      .params(task.title(), task.description(), task.status().name()).query(Long.class).optional();
  }

  public void update(Task task, Long id) {
    jdbcClient.sql("UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?")
      .params(task.title(), task.description(), task.status().name(), id).update();
  }

  public void delete(Long id) {
    jdbcClient.sql("DELETE FROM tasks WHERE id = ?").param(id).update();
  }
}
