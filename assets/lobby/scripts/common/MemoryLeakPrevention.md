# 🚨 MEMORY LEAK PREVENTION GUIDE
## Hướng dẫn ngăn chặn Memory Leak trong Minigame

> **⚠️ CẢNH BÁO QUAN TRỌNG**: 90% team dev lobby game sẽ gặp bug này sau 2-3 tháng production!

## 🔥 Triệu chứng Memory Leak

```
Open/close minigame nhiều lần
↓
FPS giảm dần (60fps → 30fps → 15fps)
↓
Memory không giảm (RAM tăng liên tục)
↓
GC spike (lag 1-2s mỗi lần GC)
↓
Crash mobile (Android kill app, iOS memory pressure)
```

## 🎯 Nguyên nhân KHÔNG phải Bundle

**❌ Nhiều dev nghĩ**: "Bundle không release → memory leak"  
**✅ Thực tế**: Bundle chỉ chiếm 5-10% memory, nguyên nhân chính là:

1. **Event Listener không remove**
2. **Schedule không unschedule** 
3. **Spine cache tích tụ**
4. **Audio source không cleanup**
5. **Tween running không stop**

## 🛡️ GIẢI PHÁP: Cleanup Lifecycle Pattern

### ✅ Template chuẩn cho mọi Minigame Component:

```javascript
cc.Class({
    extends: cc.Component,
    
    onLoad: function () {
        // ═══ SETUP EVENT LISTENERS ═══
        cc.systemEvent.on('GAME_PAUSE', this.onGamePause, this);
        cc.systemEvent.on('BALANCE_CHANGED', this.onBalanceChanged, this);
        
        // ═══ SETUP SCHEDULES ═══
        this.schedule(this.updateTimer, 1.0);
        this.schedule(this.checkConnection, 5.0);
        
        // ═══ SETUP TWEENS ═══
        this.idleTween = cc.tween(this.node)
            .repeatForever(cc.tween().to(2, {scale: 1.1}).to(2, {scale: 1.0}))
            .start();
    },
    
    onDestroy: function () {
        // ═══════════════════════════════════════════════════════════
        // 🚨 CRITICAL: CLEANUP EVERYTHING - Không được bỏ sót!
        // ═══════════════════════════════════════════════════════════
        
        // 1️⃣ Remove ALL event listeners
        cc.systemEvent.off('GAME_PAUSE', this.onGamePause, this);
        cc.systemEvent.off('BALANCE_CHANGED', this.onBalanceChanged, this);
        
        // 2️⃣ Unschedule ALL callbacks
        this.unscheduleAllCallbacks();
        
        // 3️⃣ Stop ALL tweens
        cc.Tween.stopAllByTarget(this.node);
        if (this.idleTween) {
            this.idleTween.stop();
            this.idleTween = null;
        }
        
        // 4️⃣ Release audio resources
        if (this.audioSource) {
            this.audioSource.stop();
            this.audioSource.clip = null;
        }
        
        // 5️⃣ Clear spine cache (nếu có)
        if (this.spineNode) {
            this.spineNode.clearTracks();
            this.spineNode.setAnimation(0, null, false);
        }
        
        // 6️⃣ Null out references
        this.gameData = null;
        this.networkClient = null;
        
        console.log('[' + this.node.name + '] Cleanup completed ✅');
    }
});
```

## 🔍 Checklist cho mọi Minigame

### ✅ Event Listeners
```javascript
// ❌ WRONG - sẽ leak
cc.systemEvent.on('SOME_EVENT', this.handler, this);
// Không có cc.systemEvent.off trong onDestroy

// ✅ CORRECT
onLoad() {
    cc.systemEvent.on('SOME_EVENT', this.handler, this);
}
onDestroy() {
    cc.systemEvent.off('SOME_EVENT', this.handler, this);  // 🎯 MUST HAVE
}
```

### ✅ Schedules
```javascript
// ❌ WRONG - sẽ leak
this.schedule(this.updateSomething, 1.0);
// Không có unschedule trong onDestroy

// ✅ CORRECT  
onLoad() {
    this.schedule(this.updateSomething, 1.0);
}
onDestroy() {
    this.unscheduleAllCallbacks();  // 🎯 MUST HAVE
}
```

### ✅ Tweens
```javascript
// ❌ WRONG - sẽ leak
cc.tween(this.node).to(1, {x: 100}).start();
// Tween sẽ chạy mãi dù node đã destroy

// ✅ CORRECT
onLoad() {
    this.myTween = cc.tween(this.node).to(1, {x: 100}).start();
}
onDestroy() {
    cc.Tween.stopAllByTarget(this.node);  // 🎯 MUST HAVE
    if (this.myTween) {
        this.myTween.stop();
        this.myTween = null;
    }
}
```

### ✅ Audio Sources
```javascript
onDestroy() {
    if (this.bgMusic) {
        this.bgMusic.stop();
        this.bgMusic.clip = null;  // 🎯 Release AudioClip reference
    }
}
```

### ✅ Spine Animations
```javascript
onDestroy() {
    if (this.spineNode) {
        this.spineNode.clearTracks();
        this.spineNode.setAnimation(0, null, false);  // 🎯 Clear animation
    }
}
```

## 🧪 Testing Memory Leaks

### Debug Commands (paste vào Console):
```javascript
// 1. Kiểm tra Bundle Cache
cc.BundleLoader.getInstance().getCacheStats();

// 2. Force GC test
cc.BundleLoader.getInstance().forceGC();

// 3. Kiểm tra Node count
cc.director.getScene().children.length;

// 4. Memory usage (Chrome DevTools)
performance.memory.usedJSHeapSize / 1024 / 1024 + ' MB';
```

### Test Scenario:
1. Mở/đóng Tài Xỉu 10 lần
2. Check memory usage sau mỗi lần
3. Memory phải ổn định, không tăng liên tục

## 🏆 Production Best Practices

### 1. Code Review Checklist
- [ ] Mọi `cc.systemEvent.on` đều có `cc.systemEvent.off`
- [ ] Mọi `schedule` đều có `unschedule` 
- [ ] Mọi `cc.tween` đều có `stop`
- [ ] `onDestroy` có đầy đủ cleanup code

### 2. Automated Testing
```javascript
// Test script - chạy trong Console
function testMemoryLeak(gameId, iterations = 10) {
    let initialMemory = performance.memory.usedJSHeapSize;
    
    for (let i = 0; i < iterations; i++) {
        cc.LobbyController.getInstance().joinGame(gameId);
        setTimeout(() => {
            cc.LobbyController.getInstance().destroyDynamicView(gameId);
        }, 1000);
    }
    
    setTimeout(() => {
        let finalMemory = performance.memory.usedJSHeapSize;
        let leak = (finalMemory - initialMemory) / 1024 / 1024;
        console.log(`Memory leak: ${leak.toFixed(2)} MB after ${iterations} iterations`);
    }, iterations * 1500);
}

// Usage:
testMemoryLeak(cc.GameId.TAI_XIU, 10);
```

## 🚀 Kết luận

**Memory leak là killer #1 của mobile games!**

- Desktop: có thể chịu được vài trăm MB leak
- Mobile: 50-100MB leak = crash app

**👉 LUÔN implement cleanup lifecycle pattern từ đầu, đừng để sau!**

---
*Generated by S86CLUB Architecture Team - Production-Ready Guidelines*