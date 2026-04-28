import asyncio

# Shared event for signaling that the scene queue has been updated
queue_update_event = asyncio.Event()


def trigger_scene_processing():
    """Signal the background task that the queue has been potentially updated."""
    queue_update_event.set()
