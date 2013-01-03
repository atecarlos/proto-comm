var Conversation = require('../models/conversation'),
	Message = require('../models/message');

describe('Conversation', function(){

	var conversation;

	beforeEach(function(){
		conversation = new Conversation();
	});

	describe('#lastMessages', function(){

		it('returns the last two messages', function(){
			conversation.messages.push(new Message({ content: 'First in', timestamp: new Date(2012, 12, 11) }));
			conversation.messages.push(new Message({ content: 'Second in', timestamp: new Date(2012, 12, 12) }));
			conversation.messages.push(new Message({ content: 'Last in', timestamp: new Date(2012, 12, 13) }));

			var lastMessages = conversation.lastMessages;
			lastMessages.length.should.equal(2);
			lastMessages[0].content.should.equal('Second in');
			lastMessages[1].content.should.equal('Last in');
		});

		it('returns only one message', function(){
			conversation.messages.push(new Message({ content: 'Last in' }));
			var lastMessages = conversation.lastMessages;
			lastMessages.length.should.equal(1);
			lastMessages[0].content.should.equal('Last in');
		});

		it('returns no messages', function(){
			var lastMessages = conversation.lastMessages;
			lastMessages.length.should.equal(0);
		});

		afterEach(function(){
			conversation.messages = [];
		});
	});
});