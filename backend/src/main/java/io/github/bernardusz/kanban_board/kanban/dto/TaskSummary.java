package io.github.bernardusz.kanban_board.kanban.dto;

import io.github.bernardusz.kanban_board.kanban.TaskStatus;

import java.time.LocalDateTime;

public record TaskSummary(
  Long id,
  String title,
  TaskStatus status,
  LocalDateTime createdAt,
  LocalDateTime updatedAt
) {}
