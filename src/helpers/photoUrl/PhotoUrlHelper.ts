export class PhotoUrlHelper {
  static GetPhotoUrl(photoUrl: string | undefined) {
    if (!photoUrl) return undefined;
    return `http://localhost:8080/uploads/${photoUrl}`;
  }
}
