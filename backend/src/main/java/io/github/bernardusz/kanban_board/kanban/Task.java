package io.github.bernardusz.kanban_board.kanban;

import java.time.LocalDateTime;

public record Task(
  Long id,
  String title,
  String description,
  TaskStatus status,
  LocalDateTime createdAt,
  LocalDateTime updatedAt
) {}
