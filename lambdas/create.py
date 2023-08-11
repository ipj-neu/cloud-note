import json
import boto3
import logging
import uuid

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    try:
        body = json.loads(event.get("body", None))
        noteId = event.get("pathParameters", {}).get("noteId", None)
        if body is None or noteId is None: return {"statusCode": 400, "msg": "Missing note"}
        
        table = boto3.resource("dynamodb").Table("notes-v1")
        note = {
            "noteId": str(uuid.uuid4()) if noteId == "new" else noteId,
            "email": event["requestContext"]["authorizer"]["jwt"]["claims"]["email"],
            "title": body.get("title", ""),
            "note": body.get("note", "")
        }
        table.put_item(Item=note)
        return {"statusCode": 201}
        
    except Exception as e:
        logger.exception(getattr(e, "message", repr(e)))
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Error"})
        }