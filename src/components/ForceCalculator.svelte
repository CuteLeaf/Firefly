<script>
  // 1. 定义响应式变量
  let gender = 'male'; // 'male' 或 'female'
  let weight = 68;     // 体重 kg
  let footCm = 25;     // 脚长 cm

  // 2. 提取计算常数
  const g = 10;
  const L_arm = 0.03;
  const k2 = 0.4415;

  // 3. 响应式计算（Svelte 的神仙语法：$: 表示当依赖项变化时自动重新计算）
  $: M = weight;
  $: L = footCm / 100;
  $: k1 = gender === 'male' ? 0.015 : 0.012;
  $: K = (k1 * k2 * g) / L_arm;
  
  $: F_pull = K * M * L;
  $: kg_eq = F_pull / g;

  // 4. 计算性别反差对比
  $: K_male = (0.015 * k2 * g) / L_arm;
  $: K_female = (0.012 * k2 * g) / L_arm;
  $: diffN = (K_male - K_female) * M * L;
  $: diffKg = diffN / g;
</script>

<div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; max-width: 600px; margin: 20px auto; font-family: system-ui, sans-serif;">
  <h3 style="margin-top: 0; font-size: 1.2rem;">
    🧮 你的小腿需要扛多少力？
  </h3>
  
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px; font-weight: bold;">1. 你的性别</label>
    <div style="display: flex; gap: 20px;">
      <label>
        <input type="radio" bind:group={gender} value="male" /> 男生
      </label>
      <label>
        <input type="radio" bind:group={gender} value="female" /> 女生
      </label>
    </div>
  </div>
  
  <div style="margin-bottom: 15px;">
    <label style="display: block; margin-bottom: 5px; font-weight: bold;">2. 你的体重 (kg)</label>
    <input type="number" bind:value={weight} style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" min="10" max="200" />
  </div>
  
  <div style="margin-bottom: 20px;">
    <label style="display: block; margin-bottom: 5px; font-weight: bold;">3. 你的脚长 (cm) <span style="font-weight: normal;">（量一下鞋码对应的脚长）</span></label>
    <input type="number" bind:value={footCm} style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" step="0.1" min="10" max="30" />
  </div>
  
  <div style="padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
    <p style="margin: 5px 0; font-size: 0.95rem;">
      👉 你的小腿前侧需要持续付出：
    </p>
    <p style="font-size: 32px; font-weight: bold; margin: 5px 0;">
      {F_pull.toFixed(1)} <span style="font-size: 16px; font-weight: normal;">牛顿 (N)</span>
    </p>
    <p style="font-size: 14px; margin: 8px 0;">
      💡 相当于：你的脚踝上一直悬吊着一瓶 <strong>{kg_eq.toFixed(2)} 公斤</strong> 的矿泉水！
    </p>
  </div>

  <div style="margin-top: 15px; padding: 12px; border-radius: 6px; font-size: 0.9rem; border: 1px dashed #94a3b8;">
    <strong>👥 性别反差对比：</strong>
    {#if gender === 'male'}
      <span> 如果你是一位女性，在体重和脚长完全相同的情况下，你的小腿将会少承受 <strong>{diffKg.toFixed(2)} 公斤</strong> 的等效负重。</span>
    {:else}
      <span> 如果你是一位男性，在体重和脚长完全相同的情况下，你的小腿将会多承受 <strong>{diffKg.toFixed(2)} 公斤</strong> 的等效负重。</span>
    {/if}
  </div>
  
  <p style="margin-top: 15px; font-size: 12px; text-align: center;">
    * 计算基于本文推导公式：F = K × 体重 × 脚长 (K值男女有别)
  </p>
</div>