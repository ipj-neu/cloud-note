from boto3 import resource
import json
import logging
import uuid

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    try:
        pass
    except Exception as e:
        logger.exception(getattr(e, "message", repr(e)))
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({"message": "Error"})
        }