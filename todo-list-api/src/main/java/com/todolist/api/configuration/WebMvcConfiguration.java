package com.todolist.api.configuration;

import com.todolist.api.model.converter.PriorityStringConverter;
import com.todolist.api.model.converter.StatusStringConverter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new PriorityStringConverter());
        registry.addConverter(new StatusStringConverter());
    }
}
