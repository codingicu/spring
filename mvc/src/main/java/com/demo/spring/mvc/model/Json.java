package com.demo.spring.mvc.model;

import lombok.Data;

/**
 * @author codingob
 */
@Data
public class Json {
    private int code = 200;
    private String info = "json";
    private Object data = "数据";
}
