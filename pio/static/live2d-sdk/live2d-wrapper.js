/**
 * Simplified Live2D SDK Wrapper
 * Based on the working implementation from live2d-master
 */

class Live2DModel {
  constructor() {
    this.model = null;
    this.motionManager = null;
    this.eyeBlink = null;
    this.pose = null;
    this.physics = null;
    this.modelMatrix = null;
    this.dragManager = null;
    this.isInitialized = false;
    this.isVisible = true;
    this.alpha = 1.0;
  }

  // Load model from .moc file
  loadModel(mocPath, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', mocPath, true);
    request.responseType = 'arraybuffer';
    
    request.onload = () => {
      if (request.status === 200) {
        try {
          this.model = window.Live2DModelWebGL.loadModel(request.response);
          if (this.model) {
            this.initializeModel();
            callback(this);
          } else {
            console.error('Failed to load Live2D model from:', mocPath);
          }
        } catch (error) {
          console.error('Error loading Live2D model:', error);
        }
      } else {
        console.error('Failed to fetch model file:', mocPath);
      }
    };
    
    request.onerror = () => {
      console.error('Network error loading model:', mocPath);
    };
    
    request.send();
  }

  // Initialize model components
  initializeModel() {
    if (!this.model) return;

    // Initialize model matrix
    this.modelMatrix = new window.L2DModelMatrix(
      this.model.getCanvasWidth(),
      this.model.getCanvasHeight()
    );
    this.modelMatrix.setWidth(2);
    this.modelMatrix.setCenterPosition(0, 0);

    // Initialize motion manager
    this.motionManager = new window.L2DMotionManager();

    // Initialize eye blink
    this.eyeBlink = new window.L2DEyeBlink();

    // Initialize pose
    this.pose = window.L2DPose.load();

    // Initialize physics
    this.physics = window.L2DPhysics.load();

    // Initialize drag manager
    this.dragManager = new window.L2DTargetPoint();

    this.isInitialized = true;
  }

  // Load texture
  loadTexture(textureIndex, texturePath, callback) {
    if (!this.model) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const gl = window.Live2D.getGL();
      if (gl) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this.model.setTexture(textureIndex, texture);
        
        if (callback) callback();
      }
    };
    img.onerror = () => {
      console.error('Failed to load texture:', texturePath);
    };
    img.src = texturePath;
  }

  // Load motion
  loadMotion(motionPath, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', motionPath, true);
    request.responseType = 'arraybuffer';
    
    request.onload = () => {
      if (request.status === 200) {
        try {
          const motion = window.Live2DMotion.loadMotion(request.response);
          if (motion && callback) {
            callback(motion);
          }
        } catch (error) {
          console.error('Error loading motion:', error);
        }
      }
    };
    
    request.send();
  }

  // Start motion
  startMotion(motion, priority = 3) {
    if (!this.motionManager || !motion) return;
    
    this.motionManager.startMotionPrio(motion, priority);
  }

  // Set parameter value
  setParamFloat(paramId, value, weight = 1.0) {
    if (!this.model) return;
    this.model.setParamFloat(paramId, value, weight);
  }

  // Get parameter value
  getParamFloat(paramId) {
    if (!this.model) return 0;
    return this.model.getParamFloat(paramId);
  }

  // Update model
  update() {
    if (!this.isInitialized || !this.model) return;

    // Update drag
    if (this.dragManager) {
      this.dragManager.update();
      this.model.setDrag(this.dragManager.getX(), this.dragManager.getY());
    }

    // Update eye blink
    if (this.eyeBlink) {
      this.eyeBlink.updateParam(this.model);
    }

    // Update motion
    if (this.motionManager) {
      this.motionManager.updateParam(this.model);
    }

    // Update pose
    if (this.pose) {
      this.pose.updateParam(this.model);
    }

    // Update physics
    if (this.physics) {
      this.physics.updateParam(this.model);
    }

    // Update model
    this.model.update();
  }

  // Draw model
  draw() {
    if (!this.isInitialized || !this.model || !this.isVisible) return;

    const gl = window.Live2D.getGL();
    if (!gl) return;

    // Apply model matrix
    if (this.modelMatrix) {
      this.model.setMatrix(this.modelMatrix.getArray());
    }

    // Set alpha
    this.model.setAlpha(this.alpha);

    // Draw
    this.model.draw();
  }

  // Set drag position
  setDrag(x, y) {
    if (this.dragManager) {
      this.dragManager.setPoint(x, y);
    }
  }

  // Hit test
  hitTest(x, y, hitAreaName) {
    if (!this.model) return false;
    return this.model.hitTestSimple(hitAreaName, x, y);
  }

  // Release resources
  release() {
    if (this.model) {
      this.model.release();
      this.model = null;
    }
    this.isInitialized = false;
  }
}

// Live2D Manager
class Live2DManager {
  constructor() {
    this.gl = null;
    this.models = [];
    this.currentModelIndex = 0;
    this.isInitialized = false;
  }

  // Initialize WebGL context
  setGL(gl) {
    this.gl = gl;
    window.Live2D.setGL(gl);
    this.isInitialized = true;
  }

  // Get WebGL context
  getGL() {
    return this.gl;
  }

  // Create new model
  createModel() {
    return new Live2DModel();
  }

  // Add model
  addModel(model) {
    this.models.push(model);
    return this.models.length - 1;
  }

  // Get model
  getModel(index) {
    if (index >= 0 && index < this.models.length) {
      return this.models[index];
    }
    return null;
  }

  // Get current model
  getCurrentModel() {
    return this.getModel(this.currentModelIndex);
  }

  // Set current model
  setCurrentModel(index) {
    if (index >= 0 && index < this.models.length) {
      this.currentModelIndex = index;
    }
  }

  // Update all models
  updateModels() {
    this.models.forEach(model => {
      if (model) {
        model.update();
      }
    });
  }

  // Draw all models
  drawModels() {
    if (!this.gl) return;

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.models.forEach(model => {
      if (model) {
        model.draw();
      }
    });
  }

  // Release all models
  releaseModels() {
    this.models.forEach(model => {
      if (model) {
        model.release();
      }
    });
    this.models = [];
  }
}

// Export to global scope
window.Live2DManager = Live2DManager;
window.Live2DModel = Live2DModel;

// Global Live2D manager instance
window.live2dManager = new Live2DManager();