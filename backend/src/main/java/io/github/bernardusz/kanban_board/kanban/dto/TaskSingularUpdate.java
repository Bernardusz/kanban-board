package io.github.bernardusz.kanban_board.kanban.dto;

import io.github.bernardusz.kanban_board.kanban.TaskStatus;

public record TaskSingularUpdate (
  String title,
  String description,
  TaskStatus status
){}
