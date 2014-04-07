#include <pebble.h>

Window *window;	
TextLayer *text_layer;
	
// Key values for AppMessage Dictionary
enum {
	MESSAGE_KEY = 0
};

// Called when a message is received from PebbleKitJS
static void in_received_handler(DictionaryIterator *received, void *context) {
	Tuple *tuple;
	
	tuple = dict_find(received, MESSAGE_KEY);
	if(tuple) {
		APP_LOG(APP_LOG_LEVEL_DEBUG, "Received Message: %s", tuple->value->cstring);
        text_layer_set_text(text_layer, tuple->value->cstring);
	}}

// Called when PebbleKitJS does not acknowledge receipt of a message
static void out_failed_handler(DictionaryIterator *failed, AppMessageResult reason, void *context) {
}

void init(void) {
	window = window_create();
    window_set_background_color(window, GColorBlack);
	window_stack_push(window, true);
	
	// Register AppMessage handlers
	app_message_register_inbox_received(in_received_handler); 
		
	app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());

    Layer *window_layer = window_get_root_layer(window);
    GRect bounds = layer_get_bounds(window_layer);

    text_layer = text_layer_create((GRect) { .origin = { 0, 50 }, .size = { bounds.size.w, 60 } });
    text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
    text_layer_set_font(text_layer, fonts_get_system_font(FONT_KEY_DROID_SERIF_28_BOLD));
    text_layer_set_text_color(text_layer, GColorWhite);
    text_layer_set_background_color(text_layer, GColorBlack);
    layer_add_child(window_layer, text_layer_get_layer(text_layer));
	
}

void deinit(void) {
	app_message_deregister_callbacks();
    text_layer_destroy(text_layer);
	window_destroy(window);
}

int main( void ) {
	init();
	app_event_loop();
	deinit();
}
