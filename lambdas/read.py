import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    try:
        email = event["requestContext"]["authorizer"]["jwt"]["claims"]["email"]

        notes = boto3.resource("dynamodb").Table("notes-v1").query(
            IndexName="emailIndex",
            KeyConditionExpression="email = :email",
            ExpressionAttributeValues={":email": email}
        ).get("Items", [])

        logger.info(notes)

        return {
            "statusCode": 200,
            "body": json.dumps(notes)
        }
    except Exception as e:
        logger.exception(getattr(e, "message", repr(e)))
        return json.loads({
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Error"})
        })