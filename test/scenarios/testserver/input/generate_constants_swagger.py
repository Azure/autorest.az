import itertools

header="""{
    "swagger": "2.0",
    "info": {
        "title": "AutoRest Swagger Constant Service",
        "description": "Test Infrastructure for AutoRest Swagger Constant",
        "version": "1.0.0"
    },
    "host": "localhost:3000",
    "schemes": [
        "http"
    ],
    "produces": [
        "application/json"
    ],
    "consumes": [
        "application/json"
    ],
    "paths": {
"""
footer = """    }
}"""

template_op = """        "/constants/put{operation_id}": {{
            "put": {{
                "operationId": "contants_put{operation_id}",
                "summary": "Puts constants to the testserver",
                "parameters": [
                    {{
                        "name": "input",
                        "in": "query",
                        "type": "string",
                        "enum": [
                            {values}
                        ],
                        "x-ms-enum": {{
                            "name": "{operation_id}OpEnum",
                            "modelAsString": {model_as_string}
                        }},
                        "required": {required}{default}
                    }}
                ],
                "responses": {{
                    "201": {{
                        "description": "Indicates success."
                    }}
                }}
            }}
        }}
"""

template_model = """        "{model_name}": {{
            "type":  "object",
            "properties": {{
                "parameter" : {{
                    "type": "string",
                    "enum": [
                        {values}
                    ],
                    "x-ms-enum": {{
                        "name": "{model_name}Enum",
                        "modelAsString": {model_as_string}
                    }}
                    {default}
                }}
            }}{required}
        }}
"""

ModelAsString = {True, False}
Required = {True, False}
OneValue = {True, False}
Default = {True, False}

def do_it_operation(model_as_string, required, one_value, default):

    operation_id = (
        "{}ModelAsString".format("" if model_as_string else "No") +
        "{}Required".format("" if required else "No") +
        "{}Value".format("One" if one_value else "Two") +
        "{}Default".format("" if default else "No")
    )
    values = '"value1"' if one_value else '"value1", "value2"'
    default = ',\n                        "x-ms-client-default": "value1"' if default else ''

    return template_op.format(
        operation_id=operation_id,
        values=values,
        model_as_string=str(model_as_string).lower(),
        required=str(required).lower(),
        default=default
    )

def do_it_model(model_as_string, required, one_value, default):

    model_name = (
        "{}ModelAsString".format("" if model_as_string else "No") +
        "{}Required".format("" if required else "No") +
        "{}Value".format("One" if one_value else "Two") +
        "{}Default".format("" if default else "No")
    )
    values = '"value1"' if one_value else '"value1", "value2"'
    default = ',\n                        "x-ms-client-default": "value1"' if default else ''
    required=',\n            "required": ["parameter"]' if required else ''

    return template_model.format(
        model_name=model_name,
        values=values,
        model_as_string=str(model_as_string).lower(),
        required=required,
        default=default
    )


def do_all():
    print(header)
    print(",".join(
        [do_it_operation(*comb) for comb in itertools.product(ModelAsString, Required, OneValue, Default)]
    ))
    print('    },\n    "definitions": {')
    print(",".join(
        [do_it_model(*comb) for comb in itertools.product(ModelAsString, Required, OneValue, Default)]
    ))
    print(footer)

if __name__ == "__main__":
    do_all()