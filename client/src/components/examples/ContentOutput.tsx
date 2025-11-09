import { ContentOutput } from '../ContentOutput';

const mockPlainText = `# Premium Wireless Headphones - The Ultimate Audio Experience

## What Are Premium Wireless Headphones?

Premium wireless headphones represent the pinnacle of personal audio technology, combining cutting-edge sound quality with the freedom of wireless connectivity. These sophisticated audio devices use advanced Bluetooth technology to deliver crystal-clear sound without the constraints of cables.

## Why Choose Premium Wireless Headphones?

In today's mobile-first world, premium wireless headphones offer unparalleled convenience and quality. Whether you're commuting, working out, or simply relaxing at home, these headphones provide:

- **Exceptional Sound Quality**: Advanced drivers and noise-cancellation technology deliver immersive audio
- **Ultimate Comfort**: Ergonomic design for extended listening sessions
- **Seamless Connectivity**: Quick pairing with all your devices
- **Long Battery Life**: Up to 30 hours of continuous playback

## How Do They Work?

Premium wireless headphones utilize state-of-the-art Bluetooth 5.0+ technology to maintain a stable connection with your devices. Active noise cancellation (ANC) uses microphones to detect ambient sound and generates opposite sound waves to cancel it out, creating a peaceful listening environment.

## Who Are These For?

These headphones are perfect for:
- Music enthusiasts who demand the best audio quality
- Professionals working in noisy environments
- Travelers seeking comfort and noise isolation
- Audiophiles who appreciate premium sound engineering

## Use Cases

1. **Daily Commute**: Block out traffic noise and enjoy your favorite podcasts
2. **Work From Home**: Participate in crystal-clear video calls
3. **Fitness**: Sweat-resistant design for intense workouts
4. **Travel**: Foldable design and carrying case for easy portability

## Pros & Cons

### Pros
✓ Superior sound quality with deep bass and clear highs
✓ Industry-leading noise cancellation
✓ Comfortable for all-day wear
✓ Premium build quality with durable materials
✓ Multi-device connectivity

### Cons
✗ Premium price point
✗ Requires regular charging
✗ May be bulky for some users

## Alternatives

While these premium headphones lead the market, alternatives include:
- Mid-range wireless options for budget-conscious buyers
- Wired audiophile headphones for purists
- True wireless earbuds for ultra-portability

## Frequently Asked Questions

**Q: How long does the battery last?**
A: Up to 30 hours with ANC on, 40 hours with ANC off.

**Q: Are they compatible with all devices?**
A: Yes, they work with any Bluetooth-enabled device including smartphones, tablets, and computers.

**Q: Can I use them while charging?**
A: Absolutely! The included cable allows for wired listening while charging.

## Conclusion

Premium wireless headphones represent an investment in your audio experience. With exceptional sound quality, comfort, and features, they're the perfect companion for anyone who values superior audio. Whether you're a music lover, frequent traveler, or remote worker, these headphones will transform how you experience sound.

Ready to elevate your listening experience? Check out the latest deals and make the upgrade today!`;

const mockHtml = `<article>
  <h1>Premium Wireless Headphones - The Ultimate Audio Experience</h1>
  
  <h2>What Are Premium Wireless Headphones?</h2>
  <p>Premium wireless headphones represent the pinnacle of personal audio technology, combining cutting-edge sound quality with the freedom of wireless connectivity. These sophisticated audio devices use advanced Bluetooth technology to deliver crystal-clear sound without the constraints of cables.</p>
  
  <h2>Why Choose Premium Wireless Headphones?</h2>
  <p>In today's mobile-first world, <a href="https://example.com/affiliate" target="_blank" rel="nofollow">premium wireless headphones</a> offer unparalleled convenience and quality. Whether you're commuting, working out, or simply relaxing at home, these headphones provide:</p>
  <ul>
    <li><strong>Exceptional Sound Quality</strong>: Advanced drivers and noise-cancellation technology deliver immersive audio</li>
    <li><strong>Ultimate Comfort</strong>: Ergonomic design for extended listening sessions</li>
    <li><strong>Seamless Connectivity</strong>: Quick pairing with all your devices</li>
    <li><strong>Long Battery Life</strong>: Up to 30 hours of continuous playback</li>
  </ul>
  
  <h2>Pros &amp; Cons</h2>
  <h3>Pros</h3>
  <ul>
    <li>Superior sound quality with deep bass and clear highs</li>
    <li>Industry-leading noise cancellation</li>
    <li>Comfortable for all-day wear</li>
  </ul>
  
  <h3>Cons</h3>
  <ul>
    <li>Premium price point</li>
    <li>Requires regular charging</li>
  </ul>
  
  <h2>Conclusion</h2>
  <p>Premium wireless headphones represent an investment in your audio experience. Ready to elevate your listening experience? <a href="https://example.com/affiliate" target="_blank" rel="nofollow">Check out the latest deals</a> and make the upgrade today!</p>
</article>`;

export default function ContentOutputExample() {
  return (
    <div className="p-6">
      <ContentOutput
        plainText={mockPlainText}
        html={mockHtml}
        isGenerating={false}
      />
    </div>
  );
}
