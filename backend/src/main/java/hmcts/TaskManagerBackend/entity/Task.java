package hmcts.TaskManagerBackend.entity;

// Importing required classes (using jakarta.persistence now)
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
//@Getter
//@Setter

// Class
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long taskId;

    @CreatedDate
    @Column(updatable = false)
//    @JsonFormat(shape = JsonFormat. Shape. STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")

    private LocalDateTime createdDate;
    @JsonFormat(shape = JsonFormat. Shape. STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dueDateTime;


    private String title;
    @Column(columnDefinition = "TEXT")
    private String description ;
    private Boolean status;

}