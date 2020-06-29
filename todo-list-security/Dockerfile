FROM openjdk:8-jdk-alpine
VOLUME /var/log
ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-Dspring.profiles.active=local","-cp","app:app/lib/*","com.todolist.security.TodoListSecurityApplication"]