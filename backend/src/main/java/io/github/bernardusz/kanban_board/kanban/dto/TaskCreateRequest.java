package io.github.bernardusz.kanban_board.kanban.dto;

public record TaskCreateRequest (
  String title,
  String description
){}
