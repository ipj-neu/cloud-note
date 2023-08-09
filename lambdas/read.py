from boto3 import resource
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    try:
        logger.info(event)
        logger.info(context)
        return {
            "statusCode": 200,
            "body": json.dumps({"msg": "pong"})
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