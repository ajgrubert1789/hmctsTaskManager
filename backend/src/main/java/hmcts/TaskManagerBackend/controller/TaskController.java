package hmcts.TaskManagerBackend.controller;

import java.util.List;
import hmcts.TaskManagerBackend.entity.Task;
import hmcts.TaskManagerBackend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Tasks", description = "CRUD operations for Task resources")


public class TaskController {

    @Autowired private TaskService taskService;

    @Operation(
            summary = "Create a new task",
            description = "Saves a new task to the database",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Task created successfully",
                            content = @Content(schema = @Schema(implementation = Task.class)))
            }
    )


    // Save operation
    @PostMapping("/tasks")
    public Task saveTask(
            @RequestBody Task task)
    {
        return taskService.saveTask(task);
    }

    @Operation(
            summary = "fetch all tasks",
            description = "Returns a list of all tasks"
    )


    // Read operation
    @GetMapping("/tasks")
    public List<Task> fetchTaskList()
    {
        return taskService.fetchTaskList();
    }

    @Operation(
            summary = "Get a task by ID",
            description = "Returns a single task",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Task found"),
                    @ApiResponse(responseCode = "404", description = "Task not found")
            }
    )


    // Get operation
    @GetMapping("/tasks/{id}")
    public Task getTaskById(@PathVariable("id") Long id)
    {
        return taskService.getTaskById(id);
    }

    @Operation(
            summary = "Update an existing task",
            description = "Updates a task by its ID"
    )


    // Update operation
    @PutMapping("/tasks/{id}")
    public Task updateTask(@RequestBody Task task,
                     @PathVariable("id") Long taskId)
    {
        return taskService.updateTask(
                task, taskId);
    }

    @Operation(
            summary = "Delete a task",
            description = "Deletes a task by its ID"
    )


    // Delete operation
    @DeleteMapping("/tasks/{id}")
    public String deleteTaskById(@PathVariable("id")
                                       Long taskId)
    {
        taskService.deleteTaskById(
                taskId);
        return "Deleted Successfully";
    }
}