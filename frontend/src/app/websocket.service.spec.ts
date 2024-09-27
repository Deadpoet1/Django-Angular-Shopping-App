import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { PLATFORM_ID } from '@angular/core';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockWebSocket: any;

  beforeEach(() => {
    mockWebSocket = {
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
      send: jasmine.createSpy('send'),
      readyState: WebSocket.OPEN
    };

    // Mock the WebSocket object
    (window as any).WebSocket = jasmine.createSpy('WebSocket').and.returnValue(mockWebSocket);

    TestBed.configureTestingModule({
      providers: [
        WebSocketService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('connect', () => {
    it('should create a new WebSocket connection', () => {
      const url = 'ws://example.com';
      service.connect(url);
      expect(WebSocket).toHaveBeenCalledWith(url);
    });

    it('should set up event handlers', () => {
      service.connect('ws://example.com');
      expect(mockWebSocket.onopen).toBeDefined();
      expect(mockWebSocket.onmessage).toBeDefined();
      expect(mockWebSocket.onerror).toBeDefined();
      expect(mockWebSocket.onclose).toBeDefined();
    });

    it('should log when connection is established', () => {
      spyOn(console, 'log');
      service.connect('ws://example.com');
      mockWebSocket.onopen();
      expect(console.log).toHaveBeenCalledWith('WebSocket connection established');
    });

    it('should log received messages', () => {
      spyOn(console, 'log');
      service.connect('ws://example.com');
      mockWebSocket.onmessage({ data: 'test message' });
      expect(console.log).toHaveBeenCalledWith('Received message:', 'test message');
    });

    it('should log errors', () => {
      spyOn(console, 'error');
      service.connect('ws://example.com');
      mockWebSocket.onerror('test error');
      expect(console.error).toHaveBeenCalledWith('WebSocket error:', 'test error');
    });

    it('should log when connection is closed', () => {
      spyOn(console, 'log');
      service.connect('ws://example.com');
      mockWebSocket.onclose();
      expect(console.log).toHaveBeenCalledWith('WebSocket connection closed');
    });
  });

  
  describe('Platform checking', () => {
    it('should not create WebSocket on server-side rendering', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          WebSocketService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });
      const serverService = TestBed.inject(WebSocketService);
      serverService.connect('ws://example.com');
      expect(WebSocket).not.toHaveBeenCalled();
    });
  });
});
