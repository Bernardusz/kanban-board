package io.github.bernardusz.kanban_board.kanban.dto;
import io.github.bernardusz.kanban_board.kanban.TaskStatus;

public record TaskBatchUpdate(
  Long id,
  TaskStatus status,
  Integer position
) {}