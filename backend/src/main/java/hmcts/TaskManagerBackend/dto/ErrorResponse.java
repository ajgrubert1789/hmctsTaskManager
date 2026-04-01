package hmcts.TaskManagerBackend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Standard error response")

public class ErrorResponse {

    @Schema(description = "HTTP status code", example = "404")
    private int status;

    @Schema(description = "Short error message", example = "Task not found")
    private String message;

    @Schema(description = "Timestamp of the error", example = "2026-03-29T13:45:00")
    private String timestamp;

}
