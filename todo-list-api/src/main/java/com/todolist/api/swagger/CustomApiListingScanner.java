package com.todolist.api.swagger;

import com.fasterxml.classmate.TypeResolver;
import com.google.common.collect.Multimap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import springfox.documentation.builders.ApiListingBuilder;
import springfox.documentation.builders.OperationBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiDescription;
import springfox.documentation.service.ApiListing;
import springfox.documentation.service.Operation;
import springfox.documentation.service.ResponseMessage;
import springfox.documentation.service.Tag;
import springfox.documentation.spring.web.plugins.DocumentationPluginsManager;
import springfox.documentation.spring.web.readers.operation.CachingOperationNameGenerator;
import springfox.documentation.spring.web.scanners.ApiDescriptionReader;
import springfox.documentation.spring.web.scanners.ApiListingScanner;
import springfox.documentation.spring.web.scanners.ApiListingScanningContext;
import springfox.documentation.spring.web.scanners.ApiModelReader;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

public class CustomApiListingScanner extends ApiListingScanner {
    @Autowired
    private TypeResolver typeResolver;

    @Autowired
    public CustomApiListingScanner(ApiDescriptionReader apiDescriptionReader, ApiModelReader apiModelReader, DocumentationPluginsManager pluginsManager) {
        super(apiDescriptionReader, apiModelReader, pluginsManager);
    }

    @Override
    public Multimap<String, ApiListing> scan(ApiListingScanningContext context) {
        final Multimap<String, ApiListing> def = super.scan(context);

        final List<ApiDescription> apis = new LinkedList<>();

        final Set<ResponseMessage> responses = new HashSet<>(Arrays.asList(
                new ResponseMessageBuilder().code(401).message("Unauthorized").build(),
                new ResponseMessageBuilder().code(200).message("OK").build()
        ));

        final List<Operation> operations = new ArrayList<>();
        operations.add(new OperationBuilder(new CachingOperationNameGenerator())
                .method(HttpMethod.POST)
                .uniqueId("login")
                .parameters(Arrays.asList(
                        new ParameterBuilder()
                                .order(1)
                                .name("username")
                                .required(true)
                                .description("Username")
                                .parameterType("formData")
                                .type(typeResolver.resolve(String.class))
                                .modelRef(new ModelRef("string"))
                                .build(),
                        new ParameterBuilder()
                                .order(2)
                                .name("password")
                                .required(true)
                                .description("Password")
                                .parameterType("formData")
                                .type(typeResolver.resolve(String.class))
                                .modelRef(new ModelRef("string"))
                                .build()
                ))
                .summary("Login")
                .tags(new HashSet<>(Arrays.asList("login")))
                .responseMessages(responses)
                .consumes(new HashSet<>(Arrays.asList("application/x-www-form-urlencoded")))
                .build());

        apis.add(new ApiDescription("login", "/login", "Login", operations, false));

        def.put("login", new ApiListingBuilder(context.getDocumentationContext().getApiDescriptionOrdering())
                .basePath("/")
                .resourcePath("/")
                .apiVersion("1.0")
                .apis(apis)
                .description("Login")
                .tags(new HashSet<>(Arrays.asList(new Tag("login","Login to use other api endpoints"))))
                .build());

        return def;
    }
}
