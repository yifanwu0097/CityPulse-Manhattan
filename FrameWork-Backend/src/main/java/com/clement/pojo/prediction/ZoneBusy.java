package com.clement.pojo.prediction;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * @Author Qinghan Huang
 * @Date 2023/7/21 12:56
 * @Desc
 * @Version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ZoneBusy implements Serializable {
    @JsonFormat(pattern = "yyyy-MM-dd-HH")
    private LocalDateTime time;
    private int zid;
    private int busy;
}
