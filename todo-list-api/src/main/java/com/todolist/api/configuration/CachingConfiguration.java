package com.todolist.api.configuration;

import com.google.common.cache.CacheBuilder;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CachingConfiguration {

    @Bean
    public CacheManager cacheManager(){
        return new ConcurrentMapCacheManager("todos") {

          @Override
          protected Cache createConcurrentMapCache(final String name) {
              return new ConcurrentMapCache(name,
                      CacheBuilder.newBuilder().expireAfterWrite(30, TimeUnit.SECONDS).maximumSize(100).build().asMap(), false);
          }
        };
    }
}
