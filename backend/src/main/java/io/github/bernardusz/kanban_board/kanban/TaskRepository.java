package io.github.bernardusz.kanban_board.kanban;

import io.github.bernardusz.kanban_board.kanban.dto.TaskCreateRequest;
import io.github.bernardusz.kanban_board.kanban.dto.TaskSingularUpdate;
import io.github.bernardusz.kanban_board.kanban.dto.TaskSummary;
import io.github.bernardusz.kanban_board.kanban.dto.TaskBatchUpdate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TaskRepository {
  private final JdbcClient jdbcClient;
  private final JdbcTemplate jdbcTemplate;
  public TaskRepository(JdbcClient jdbcClient, JdbcTemplate jdbcTemplate) {
    this.jdbcClient = jdbcClient;
    this.jdbcTemplate = jdbcTemplate;
  }

  public List<TaskSummary> findAll() {
    return jdbcClient.sql("""
            SELECT 
            id, title, status, created_at, updated_at
            FROM tasks
            ORDER BY position ASC
            """)
      .query(TaskSummary.class).list();
  }

  public Optional<Task> findById(Long id) {
    return jdbcClient.sql("SELECT * FROM tasks WHERE id = ?").param(id).query(Task.class).optional();
  }

  public Optional<Long> create(TaskCreateRequest task, Integer position){
    return jdbcClient.sql("INSERT INTO tasks (title, description, position) VALUES (?, ?, ?) RETURNING id")
      .params(task.title(), task.description(), position).query(Long.class).optional();
  }

  public void update(TaskSingularUpdate task, Long id) {
    jdbcClient.sql("UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = NOW() WHERE id = ?")
      .params(task.title(), task.description(), task.status().name(), id).update();
  }

  public void update(List<TaskBatchUpdate> tasks) {
    String sql = "UPDATE tasks SET status = ?, position = ?, updated_at = NOW() WHERE id = ?";

    jdbcTemplate.batchUpdate(sql, tasks, tasks.size(),
        (preparedStatement, argument) -> {
          preparedStatement.setString(1, argument.status().name());
          preparedStatement.setInt(2, argument.position());
          preparedStatement.setLong(3, argument.id());
        }
      );
  }

  public void delete(Long id) {
    jdbcClient.sql("DELETE FROM tasks WHERE id = ?").param(id).update();
  }

  public Integer getTodoCount(){
    return jdbcClient.sql("SELECT COUNT(*) FROM tasks WHERE status = 'TODO'").query(Integer.class).single();
  }
}
