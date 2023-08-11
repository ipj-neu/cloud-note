import json
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    try:
        email = event["requestContext"]["authorizer"]["jwt"]["claims"]["email"]
        noteId = event.get("pathParameters", {}).get("noteId", None)
        if noteId is None: return {"statusCode": 400, "message": "Missing path param"}
        
        table = boto3.resource("dynamodb").Table("notes-v1")
        table.delete_item(Key={"noteId": noteId, "email": email})

        return {"statusCode": 200}

    except Exception as e:
        logger.exception(getattr(e, "message", repr(e)))
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Error"})
        }