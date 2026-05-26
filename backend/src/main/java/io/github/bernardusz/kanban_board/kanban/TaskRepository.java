package io.github.bernardusz.kanban_board.kanban;

import io.github.bernardusz.kanban_board.kanban.dto.TaskCreateRequest;
import io.github.bernardusz.kanban_board.kanban.dto.TaskSummary;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TaskRepository {
  private final JdbcClient jdbcClient;
  public TaskRepository(JdbcClient jdbcClient) {
    this.jdbcClient = jdbcClient;
  }

  public List<TaskSummary> findAll() {
    return jdbcClient.sql("SELECT id, title, status, created_at, updated_at FROM tasks").query(TaskSummary.class).list();
  }

  public Task findById(long id) {
    return jdbcClient.sql("SELECT * FROM task WHERE id = ?").param(id).query(Task.class).single();
  }

  public void create(TaskCreateRequest task){
    jdbcClient.sql("INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)")
      .params(task.title(), task.description(), task.status()).update();
  }

  public void update(Task task) {
    jdbcClient.sql("UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?")
      .params(task.title(), task.description(), task.status(), task.id()).update();
  }

  public void delete(long id) {
    jdbcClient.sql("DELETE FROM tasks WHERE id = ?").param(id).update();
  }
}
