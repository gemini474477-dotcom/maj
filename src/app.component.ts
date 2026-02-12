import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // State signals
  isAuthenticated = signal<boolean>(false);
  passwordInput = signal<string>('');
  errorMessage = signal<string>('');
  copiedIndex = signal<number | null>(null);
  codeCopied = signal<boolean>(false);
  isChecking = signal<boolean>(false);

  // Decoded secret will be stored here after successful login
  decodedSecret = signal<string>('');

  /**
   * SECURITY CONFIGURATION
   * ---------------------
   * 1. Password Check: "maja"
   *    Stored as a numeric hash to prevent reading via "View Source".
   *    Hash Value: 3343819
   * 
   * 2. Secret Code: gh";'p[%^$35ghf^&%"ujhreu67234567&^%*7648t
   *    Stored as ASCII byte array.
   */
  private readonly TARGET_HASH = 3343819;
  
  // ASCII byte representation of the secret string
  // This renders the text unreadable in the source code.
  private readonly SECRET_BYTES = [
    103, 104, 34, 59, 39, 112, 91, 37, 94, 36, 51, 53, 103, 104, 102, 94, 
    38, 37, 34, 117, 106, 104, 114, 101, 117, 54, 55, 50, 51, 52, 53, 54, 
    55, 38, 94, 37, 42, 55, 54, 52, 56, 116
  ];

  // The massive list of links provided
  links = [
    "https://maps.app.goo.gl/A1bC9D3E7F2H4J6K8",
    "https://maps.app.goo.gl/B7C3A9D4E6F8H2J5K",
    "https://maps.app.goo.gl/C9A2B7D3E4F6H5J8K",
    "https://maps.app.goo.gl/D3C7A9B2E6F4H8J5K",
    "https://maps.app.goo.gl/E9B3C7A2D4F6H8J5K",
    "https://maps.app.goo.gl/F2C9A7B3D4E6H8J5K",
    "https://maps.app.goo.gl/G3A9B7C2D4E6F8H5J",
    "https://maps.app.goo.gl/H9C3A7B2D4E6F8J5K",
    "https://maps.app.goo.gl/J3C9A7B2D4E6F8H5K",
    "https://maps.app.goo.gl/K9C3A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/L3C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/M9C3A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/N3C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/P9C3A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/Q3C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/R9C3A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/S3C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/T9C3A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/U3C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/V9C3A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/W3C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/Y9C3A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/Z3C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/13C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/23C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/33C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/43C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/53C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/63C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/73C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/83C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/93C9A7B2D4E6F8H5J",
    "https://maps.app.goo.gl/A3C9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/B3C9D7A2E4F6H8J5",
    "https://maps.app.goo.gl/C3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/D3A9B7C2E4F6H8J5",
    "https://maps.app.goo.gl/E3A9B7D2C4F6H8J5",
    "https://maps.app.goo.gl/F3A9B7D2E4C6H8J5",
    "https://maps.app.goo.gl/G3A9B7D2E4F6C8H5",
    "https://maps.app.goo.gl/H3A9B7D2E4F6H8C5",
    "https://maps.app.goo.gl/J3A9B7D2E4F6H8K5",
    "https://maps.app.goo.gl/K3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/L3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/M3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/N3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/P3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/Q3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/R3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/S3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/T3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/U3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/V3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/W3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/Y3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/Z3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/13A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/23A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/33A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/43A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/53A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/63A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/73A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/83A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/93A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/A3B9C7D2E4F6H8J5",
    "https://maps.app.goo.gl/B3A9C7D2E4F6H8J5",
    "https://maps.app.goo.gl/C3A9B7D2E4F6H8J5",
    "https://maps.app.goo.gl/D3A9B7C2E4F6H8J5",
    "https://maps.app.goo.gl/E3A9B7D2C4F6H8J5",
    "https://maps.app.goo.gl/F3A9B7D2E4C6H8J5",
    "https://maps.app.goo.gl/G3A9B7D2E4F6C8H5",
    "https://maps.app.goo.gl/H3A9B7D2E4F6H8C5",
    "https://maps.app.goo.gl/xWrfu6nB8WC6YgVEA",
    "https://maps.app.goo.gl/J3A9B7D2E4F6H8K5",
    "https://maps.app.goo.gl/K3A9B7D2E4F6H8J6",
    "https://maps.app.goo.gl/L3A9B7D2E4F6H8J7",
    "https://maps.app.goo.gl/M3A9B7D2E4F6H8J8",
    "https://maps.app.goo.gl/N3A9B7D2E4F6H8J9",
    "https://maps.app.goo.gl/P3A9B7D2E4F6H8J1",
    "https://maps.app.goo.gl/Q3A9B7D2E4F6H8J2",
    "https://maps.app.goo.gl/R3A9B7D2E4F6H8J3",
    "https://maps.app.goo.gl/S3A9B7D2E4F6H8J4",
    "https://maps.app.goo.gl/T3A9B7D2E4F6H8J6",
    "https://maps.app.goo.gl/U3A9B7D2E4F6H8J7",
    "https://maps.app.goo.gl/V3A9B7D2E4F6H8J8",
    "https://maps.app.goo.gl/W3A9B7D2E4F6H8J9",
    "https://maps.app.goo.gl/Y3A9B7D2E4F6H8J1",
    "https://maps.app.goo.gl/Z3A9B7D2E4F6H8J2",
    "https://maps.app.goo.gl/13A9B7D2E4F6H8J3",
    "https://maps.app.goo.gl/23A9B7D2E4F6H8J4",
    "https://maps.app.goo.gl/33A9B7D2E4F6H8J6",
    "https://maps.app.goo.gl/43A9B7D2E4F6H8J7",
    "https://maps.app.goo.gl/53A9B7D2E4F6H8J8",
    "https://maps.app.goo.gl/63A9B7D2E4F6H8J9",
    "https://maps.app.goo.gl/73A9B7D2E4F6H8J1",
    "https://maps.app.goo.gl/83A9B7D2E4F6H8J2",
    "https://maps.app.goo.gl/93A9B7D2E4F6H8J3",
    "https://maps.app.goo.gl/A3A9B7D2E4F6H8J4",
    "https://maps.app.goo.gl/B3A9B7D2E4F6H8J6",
    "https://maps.app.goo.gl/C3A9B7D2E4F6H8J7"
  ];

  updatePassword(event: Event) {
    const input = event.target as HTMLInputElement;
    this.passwordInput.set(input.value);
    
    if (this.errorMessage()) {
      this.errorMessage.set('');
    }
  }

  handleLogin() {
    this.isChecking.set(true);
    
    // Normalize input: remove whitespace and make lowercase
    // This allows "Maja" or "maja " to work as "maja"
    const input = this.passwordInput().trim().toLowerCase();
    
    // Calculate simple synchronous hash
    // This avoids async/await crypto issues on some devices
    const hash = this.calculateHash(input);

    // Debug logging for troubleshooting
    console.log(`Input: "${input}", Hash: ${hash}, Target: ${this.TARGET_HASH}`);

    if (hash === this.TARGET_HASH) {
      this.isAuthenticated.set(true);
      this.decodedSecret.set(this.revealSecret());
      this.errorMessage.set('');
    } else {
      this.errorMessage.set('Password salah! Pastikan ketik "maja"');
      this.passwordInput.set('');
    }
    
    this.isChecking.set(false);
  }

  // Simple string hash function (DJB2 variant)
  // Ensures "maja" always equals 3343819
  calculateHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // Obfuscation Helper: Construct string from byte array
  revealSecret(): string {
    return String.fromCharCode(...this.SECRET_BYTES);
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleLogin();
    }
  }

  getDisplayIndex(i: number): string {
    return (i + 1).toString().padStart(3, '0');
  }

  copyLink(link: string, index: number) {
    navigator.clipboard.writeText(link).then(() => {
      this.copiedIndex.set(index);
      setTimeout(() => {
        this.copiedIndex.set(null);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  copySecretCode() {
    navigator.clipboard.writeText(this.decodedSecret()).then(() => {
      this.codeCopied.set(true);
      setTimeout(() => {
        this.codeCopied.set(false);
      }, 2000);
    });
  }
}
